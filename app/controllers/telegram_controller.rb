# Documentation on interacting with Telegram API via the gem:
# https://github.com/telegram-bot-rb/telegram-bot#controller
class TelegramController < Telegram::Bot::UpdatesController
  def message(_message)
    respond_with_welcome_message
  rescue => ex
    Rails.logger.warn "An error occurred while trying to respond to message: #{ex.class}: #{ex.message}"
    raise
  end

  def start!(*words)
    respond_with_welcome_message
  rescue => ex
    Rails.logger.warn "An error occurred while trying to respond to start message: #{ex.class}: #{ex.message}"
    raise
  end

  private

  def respond_with_welcome_message
    I18n.with_locale(locale) do
      keyboard_attrs = [[
        {
          text: t("bot.start"),
          web_app: { url: app_url }
        }
      ]]
      reply_markup = { inline_keyboard: keyboard_attrs }
      respond_with :message, text: t("bot.welcome"), reply_markup: reply_markup

      set_localized_chat_button
    end
  end

  def locale
    return I18n.default_locale unless from

    if I18n.available_locales.map(&:to_s).include?(from["language_code"])
      from["language_code"]
    else
      I18n.default_locale
    end
  end

  def set_localized_chat_button
    if chat && chat["id"].to_s.strip.present?
      begin
        Telegram.bot.set_chat_menu_button(
          chat_id: chat["id"],
          menu_button: {
            type: "web_app",
            text: I18n.t("web_app.launch"),
            web_app: { url: app_url }
          }
        )
      rescue => ex
        Rails.logger.warn "An error occurred trying to set chat menu button: #{ex.class}: #{ex.message}"
      end
    end
  end

  def app_url
    "https://#{ENV['BOT_HOST']}?startapp=#{locale}"
  end
end