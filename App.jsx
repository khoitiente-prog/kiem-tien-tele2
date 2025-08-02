import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [tgData, setTgData] = useState(null);
  const [points, setPoints] = useState(1000);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [momo, setMomo] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const adminId = "5416144916";
  const BOT_TOKEN = "8092552054:AAF89UHQY8TbGZsAUfTRdnJpCJdtAyZoYH8";

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      setTgData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  const handleWithdrawClick = () => {
    setShowWithdraw(true);
  };

  const confirmWithdraw = async () => {
    if (!momo || momo.length < 9 || momo.length > 12) {
      alert("Số điện thoại MoMo không hợp lệ!");
      return;
    }
    setWithdrawing(true);
    setPoints((prev) => prev - 1000);
    setShowWithdraw(false);

    const message = `💸 *Yêu cầu rút tiền MoMo*\n👤 User: ${tgData?.first_name || "Người dùng"}\n🆔 ID: ${tgData?.id}\n💰 Số điểm: 1000\n📱 SĐT MoMo: ${momo}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (res.ok) {
      alert("Yêu cầu rút tiền đã được gửi tới admin!");
    } else {
      alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }

    setWithdrawing(false);
  };

  return (
    <div className="p-4 space-y-4 text-center">
      <h1 className="text-2xl font-bold">🎉 Chào {tgData?.first_name || "bạn"}!</h1>
      <p className="text-lg">💰 Tổng điểm hiện tại: <b>{points}</b></p>

      <Card>
        <CardContent className="p-4 space-y-2">
          <Button className="w-full" onClick={handleWithdrawClick}>
            💵 Rút tiền MoMo
          </Button>
        </CardContent>
      </Card>

      {showWithdraw && (
        <div className="space-y-2 bg-gray-100 rounded-xl p-4">
          <p>Nhập số điện thoại MoMo để nhận tiền:</p>
          <input
            type="tel"
            placeholder="09xxxxxxx"
            value={momo}
            onChange={(e) => setMomo(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <Button className="w-full" onClick={confirmWithdraw} disabled={withdrawing}>
            {withdrawing ? "Đang xử lý..." : "✅ Xác nhận rút 1000 điểm"}
          </Button>
        </div>
      )}
    </div>
  );
}
