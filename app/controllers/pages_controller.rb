class PagesController < ApplicationController
  around_action :switch_locale

  def init
    @decks = Deck.all

    @translations = {
      yep: t("screens.learning.yep"),
      next: t("screens.learning.next"),
      close: t("screens.finished.close"),
      tutorial_title: t("tutorial.title"),
      tutorial_message: t("tutorial.message")
    }

    @app_config = { cards_per_session: 5 }
  end

  private

  def switch_locale(&action)
    locale =
      if I18n.available_locales.map(&:to_s).include?(params[:startapp])
        params[:startapp]
      else
        I18n.default_locale
      end

    I18n.with_locale(locale, &action)
  end
end
