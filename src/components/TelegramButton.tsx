"use client";

interface TelegramButtonProps {
  variant?: "primary" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export default function TelegramButton({
  variant = "primary",
  size = "md",
  className = "",
  children = "💬 Открыть Telegram бота"
}: TelegramButtonProps) {
  
  const BOT_USERNAME = "MotorSoft_bot";
  const TELEGRAM_URL = `https://t.me/${BOT_USERNAME}`;

  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
  };

  const sizes = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
