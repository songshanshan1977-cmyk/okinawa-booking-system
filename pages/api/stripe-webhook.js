// pages/api/stripe-webhook.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import getRawBody from 'raw-body';

export const config = {
  api: {
    bodyParser: false, // ⭐ 关闭默认 body 解析
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const buf = await getRawBody(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ 验证 Webhook 失败：', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 只处理支付成功事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error('❌ checkout.session 没有 orderId');
      return res.status(200).json({ received: true });
    }

    try {
      // 1）查订单（拿到 car_model_id 和 start_date）
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (orderError || !order) {
        console.error('❌ 查订单失败：', orderError);
        return res.status(200).json({ received: true });
      }

      // 2）更新订单状态为 paid
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('order_id', orderId);

      if (updateOrderError) {
        console.error('❌ 更新订单状态失败：', updateOrderError);
      }

      // 3）写入 payments 表
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          order_id: orderId,
          payment_intent_id: session.payment_intent || session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: 'succeeded',
        },
      ]);

      if (paymentError) {
        console.error('❌ 写入 payments 失败：', paymentError);
      }

      // 4）扣库存：inventory.booked += 1
      const carModelId = order.car_model_id;
      const date = order.start_date;

      // 先查有没有这一天这辆车的库存记录
      const { data: invRow, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .eq('car_model_id', carModelId)
        .eq('date', date)
        .maybeSingle();

      if (invError) {
        console.error('❌ 查询库存失败：', invError);
      } else if (invRow) {
        // 有记录：booked + 1
        const booked = (invRow.booked || 0) + 1;
        const { error: updateInvError } = await supabase
          .from('inventory')
          .update({ booked })
          .eq('id', invRow.id);

        if (updateInvError) {
          console.error('❌ 更新库存失败：', updateInvError);
        }
      } else {
        // 没有记录：新建一条（假设 total 默认 1 或其他）
        const { error: insertInvError } = await supabase.from('inventory').insert([
          {
            car_model_id: carModelId,
            date,
            total: 1,
            booked: 1,
          },
        ]);

        if (insertInvError) {
          console.error('❌ 新建库存记录失败：', insertInvError);
        }
      }

      console.log(`✅ Webhook 处理完成：订单 ${orderId} 已标记为 paid 并扣库存`);
    } catch (err) {
      console.error('❌ 处理 checkout.session.completed 出错：', err);
    }
  }

  res.status(200).json({ received: true });
}
