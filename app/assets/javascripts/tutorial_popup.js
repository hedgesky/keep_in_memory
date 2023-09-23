// There's only one tutorial in the app: a pop-up when the
// user clicks the "Forgot" button for the first time.
//
// We use CloudStorage API to remember the fact that
// a user has already seen the pop-up.
//
// However, as not all the app versions return CloudStorage object;
// so in case it's unavailable or any other issue appear,
// we gracefully fallback to not showing the pop-up.
window.Tutorial = {
  wasSeen: true,

  init: function() {
    try {
      Telegram.WebApp.CloudStorage.getItem("tutorial_was_seen", Tutorial.onStorageReadResponse);
    } catch (error) {
      console.log(error)
      Tutorial.wasSeen = true;
    }
  },

  // not used in the app, but is convenient to have it for debugging
  reset: function() {
    try {
      Telegram.WebApp.CloudStorage.removeItem("tutorial_was_seen");
    } catch (error) {
      alert(error);
    }
  },

  onStorageReadResponse: function(error, value) {
    try {
      if (error === null) {
        Tutorial.wasSeen = value == "true";
      }
    } catch(error) {
      console.log(error)
      Tutorial.wasSeen = true;
    }
  },

  showIfNeeded: function() {
    if (Tutorial.wasSeen) { return };

    Tutorial.wasSeen = true;

    try {
      Telegram.WebApp.CloudStorage.setItem("tutorial_was_seen", "true");

      Telegram.WebApp.showPopup({
        title: Translations.tutorial_title,
        message: Translations.tutorial_message,
        buttons: [{ type: "ok" }]
      });
    } catch(error) {
      console.log(error)
    }
  }
}
