// pages/api/create-payment-intent.js
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// 初始化 Supabase（服务端 key）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // 根据 orderId 查询订单（押金金额等）
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ 查订单失败：', error);
      return res.status(404).json({ error: 'Order not found' });
    }

    // 订单押金金额（Stripe 金额单位是 *分*）
    const depositAmount = (order.deposit_amount || 500) * 100;

    // ⭐ 创建 Stripe Checkout 会话
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

      // ⭐ 填入你的域名（我已经帮你换好了）
      success_url: `https://okinawa-booking-system-5bmc.vercel.app/booking/success?orderId=${orderId}`,
      cancel_url: `https://okinawa-booking-system-5bmc.vercel.app/booking/cancel?orderId=${orderId}`,

      metadata: { orderId },
    });

    // 返回 Stripe Checkout 地址
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ create-payment-intent 出错：', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

