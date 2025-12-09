// pages/api/create-payment-intent.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // 根据 orderId 查订单信息（押金金额、客户邮箱等）
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ 订单不存在：', error);
      return res.status(404).json({ error: 'Order not found' });
    }

    // 押金金额，Stripe 用“分”为单位，这里是 500 RMB = 50000 分
    const depositAmount = (order.deposit_amount || 500) * 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      payment_method_options: {
        wechat_pay: {
          client: 'web',
        },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'cny',
            unit_amount: depositAmount,
            product_data: {
              name: `冲绳包车押金 - ${orderId}`,
              description: '真诚冲绳 HonestOki 包车押金（500 RMB）',
            },
          },
        },
      ],
      customer_email: order.email || undefined,
      metadata: {
        orderId,
      },
      success_url: `https://你的域名/booking/success?orderId=${orderId}`,
      cancel_url: `https://你的域名/booking/cancel?orderId=${orderId}`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ create-payment-intent 出错：', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
