Rails.application.routes.draw do
  telegram_webhook TelegramController

  root "pages#init"
end
