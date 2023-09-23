window.Learning = {
  init: function() {
    $(".js-dont-remember").click(Learning.onClickedNo);

    try {
      Telegram.WebApp.onEvent("viewportChanged", function(e) {
        if (e.isStateStable) {
          $(".js-dont-remember").css("top", Telegram.WebApp.viewportStableHeight - 60);
        }
      });

      Telegram.WebApp.BackButton.onClick(function() {
        App.showScreen("home");
      });
    } catch(error) {
      console.log(error);
    }
  },

  onShow: function() {
    App.interactWithMainButton(function() {
      Telegram.WebApp.MainButton.show().setParams({ text_color: "#fff" });
    })
    try {
      Telegram.WebApp.BackButton.show();
    } catch(error) {
      console.log(error);
    }

    Learning.prepareNextCard();
    Learning.turnMainButtonToYes();
  },

  setDeck: function(deck) {
    Learning.deck = deck;
    Learning.currentCardIndex = -AppConfig.cards_per_session;
    Learning.setCurrentSessionCards();
    $(".js-learning-title").text(deck.header);
  },

  setCurrentSessionCards: function() {
    Learning.currentCardIndex += AppConfig.cards_per_session;
    let range_start = Learning.currentCardIndex;
    let range_end = Learning.currentCardIndex + AppConfig.cards_per_session;
    Learning.cards = Learning.deck.cards.slice(range_start, range_end);
    Learning.cards = Learning.shuffleArray(Learning.cards);
  },

  setCard: function(card) {
    Learning.currectCard = card;
    $(".js-question-text").text(card.question);
    setTimeout(function() { // delay to let the animation finish
      $(".js-answer-text").text(card.answer);
    }, 200)
  },

  revealAnswer: function() {
    $(".js-answer-hint").removeClass("invisible");
    $(".js-dont-remember").addClass("invisible");
  },

  prepareNextCard: function() {
    if (Learning.cards.length) {
      Learning.setCard(Learning.cards[0]);
      Learning.cards = Learning.cards.slice(1)

      $(".js-answer-hint").addClass("invisible");
      $(".js-dont-remember").removeClass("invisible");
    } else {
      App.showScreen("finished");
    }
  },

  hasMoreCards: function() {
    return Learning.currentCardIndex + AppConfig.cards_per_session < Learning.deck.cards.length;
  },

  onClickedYes: function() {
    Learning.revealAnswer();
    Learning.turnMainButtonToNext();

    try {
      Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    } catch(error) {
      console.log(error);
    }
  },

  onClickedNo: function() {
    Tutorial.showIfNeeded();
    Learning.cards.push(Learning.currectCard);
    Learning.revealAnswer();
    Learning.turnMainButtonToNext();

    try {
      Telegram.WebApp.HapticFeedback.notificationOccurred("warning");
    } catch(error) {
      console.log(error);
    }
  },

  onClickedNext: function() {
    Learning.turnMainButtonToYes();
    Learning.prepareNextCard();
  },

  turnMainButtonToYes: function() {
    App.clearMainButtonCallbacks();

    App.interactWithMainButton(function() {
      Telegram.WebApp.MainButton.setParams({
        text: Translations.yep,
        color: "#31b545"
      }).onClick(Learning.onClickedYes);
    })
  },

  turnMainButtonToNext: function() {
    App.clearMainButtonCallbacks();

    App.interactWithMainButton(function() {
      Telegram.WebApp.MainButton.setParams({
        text: Translations.next,
        textColor: Telegram.WebApp.themeParams.button_color || "#fff",
        color: Telegram.WebApp.themeParams.button_color || "#2ea6ff"
      }).onClick(Learning.onClickedNext);
    })
  },

  // taken from https://stackoverflow.com/a/2450976
  shuffleArray: function(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
