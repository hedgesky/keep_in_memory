## About

<img src="/docs/logo.png" alt="logo" width="300">

This repository contains the source code for a demo Telegram Mini App: [t.me/KeepInMemoryBot/app](https://t.me/KeepInMemoryBot/app
). It's built with Ruby on Rails and doesn't use additional JavaScript frameworks apart from jQuery.

The app is called "Keep in Memory" and allows you to repeat words of foreign languages. Here, we describe all its aspects — but if you want to just launch the app locally, following the [Local installation](#local-installation) is enough.

- [Local installation](#local-installation)
  - [Installation troubleshooting](#installation-troubleshooting)
- [How the app works](#how-the-app-works)
- [File structure](#file-structure)
- [Backend organization](#backend-organization)
  - [Exception handling (backend)](#exception-handling-backend)
- [Frontend organization](#frontend-organization)
  - [Exception handling (frontend)](#exception-handling-frontend)
- [App's interactions with Telegram API](#apps-interactions-with-telegram-api)
- [Translations organization](#translations-organization)
- [Deployment of the app for production usage](#deployment-of-the-app-for-production-usage)

## Local installation

Here we describe how to launch a copy of this Mini App. If you face any issues along the way, check the [Installation troubleshooting](#installation-troubleshooting) section.

### 1. Make localhost remotely accessible for Telegram

Each Mini App is similar to a regular website but is opened within the Telegram app itself and can interact with Telegram UI and API. To open it, Telegram needs to access the app's backend via HTTPS.

Thus, even when we launch the app locally, we need to make it remotely accessible for Telegram. One way to do that is by using [ngrok](https://ngrok.com). It will open a secure network tunnel to your machine, and Telegram will use it to open the app. Here's how to do that:

- Sign up for ngrok to obtain its authentication token: https://dashboard.ngrok.com/signup;
- Download ngrok: https://ngrok.com/download;
- Add the token via this command in the terminal: `ngrok config add-authtoken <token>`;
- Now, run in the terminal: `ngrok http 3000`.

Here, `3000` is the port we will launch the Rails server on.

<details>
  <summary>If ngrok is launched successfully, you'd see something like this: (click to reveal the image):</summary>

  ![localhost is available through ngrok](/docs/ngrok.png)

  *If you're on Windows, and the terminal window closed after running that command, please navigate to https://dashboard.ngrok.com/tunnels/agents to see the running process.*
</details>

Notice a URL like `https://1234-567-123-456-789.ngrok-free.app`. We'll use it later.

### 2. Create a Telegram Bot

Each Mini App requires a Telegram Bot. Let's create one. Visit [@BotFather](https://t.me/BotFather), select `/newbot` command, and follow the instructions. At the end you'll get a token value like `1234567890:AAHs57TbfYq0jmJ1afnGlka-mx0oS7TA0A0` — we'll use it later. Important: this is a secret value that could be used to control your bot; store it securely.

### 3. Create a Telegram Mini App

Telegram documentation uses the terms "Mini App" and "Web App" interchangeably, so don't let that confuse you. Let's create and configure one. Visit [@BotFather](https://t.me/BotFather), select `/newapp` command, fill in the asked details, and for the `Web App URL` value use the ngrok tunnel URL you got on step 1.

For this step, we recommend avoiding the use of the Web Telegram client: up-to-date Desktop and Mobile clients handle this process better.

### 4. Configure the Ruby on Rails application

Rails application would generate your bot's responses and Mini App HTML/CSS/JS code. Let's configure it. First, clone or download this repository. Then, in your text editor create a file called `.env` in the app directory (right next to `.env.sample`). There, you should put the bot host (URL from step 1, **but without "https://" prefix**) and bot token (from step 2). As a result, you would get something like this:

```
BOT_HOST=1234-567-123-456-789.ngrok-free.app
BOT_TOKEN=1234567890:AAHs57TbfYq0jmJ1afnGlka-mx0oS7TA0A0
```

The Rails app would use the `BOT_TOKEN` variable to authenticate its calls to Telegram API, and `BOT_HOST` to generate bot's responses.

### 5. Launch the Ruby on Rails app

The intended way to launch this Rails app is via [Docker](https://www.docker.com). With Docker, you don't need to install the required Ruby version and all dependencies manually. You'll need to install Docker itself, though: https://docs.docker.com/get-docker.

Once you have it installed, launch the following command in the terminal in the app's directory:

```bash
docker-compose up
```

That's it! This command launched two processes: a web server to generate HTML/CSS/JS content, and a process which responds to messages to your bot.

Now, if you proceed to the app link that [@BotFather](https://t.me/BotFather) sent you (like [t.me/YourBot/your_app](https://t.me/YourBot/your_app)), you will see a confirmation from Ngrok. Accept it, and you will see your app!

<img src="/docs/app.png" alt="screenshot of your app" width="400">

### Installation troubleshooting

<details>
  <summary>If you face issues during installation, click here to check known possible obstacles:</summary>

  - On Windows, ngrok has a known issue of closing terminal windows without terminating its process. After that, it doesn't allow to launch new ones. To terminate such stale processes, please navigate to https://dashboard.ngrok.com/tunnels/agents.
  - Not all Telegram clients support Mini Apps equally. If you experience issues opening this Mini App, try updating your Telegram client app.
  - If the Rails app exits with an error like `key not found: BOT_HOST`, check that the app's root folder contains `.env` file with the required config variables.
  - If the Mini Apps doesn't open in the Telegram Client and just loads indefinitely, check the Rails logs in the terminal to see if there are any errors. Also, you might try to open http://localhost:3000 in your browser to see if the Rails app is operational. If it is, you'd see the home screen of the app (but it won't be fully functional).
  - The output from the `docker-compose up` command from step 5 should be similar to the image below. If it contains errors instead, the error messages might point to the issue.

    ![output of the "docker-compose up" command](/docs/docker-compose.png)
</details>

---

## How the app works

Here we describe a possible interaction flow between the user, Telegram, and the app's server:

1. User opens the bot link: https://t.me/KeepInMemoryBot.
2. Telegram shows the bot's description page.
3. User taps the "Start" button. Telegram sends a notification to the app's server.
4. App's server sends a button to open the app to the chat with user. User taps that button.
5. Telegram sends a request to the app's server. It responds with an HTML page.
6. Telegram client processes that HTML page. It contains links to CSS and JS files, so the client also downloads and applies them. Now the app is initialized.

## File structure

This project follows the standard Ruby on Rails structure. You can learn more about Rails in the [official guide](https://guides.rubyonrails.org/getting_started.html). For now, let's describe the files this project uses:

- `app/models/*.rb`: declare main app entities: `Word`, `Card`, `Deck`.
- `app/controllers/telegram_controller.rb`: generates Telegram bot's responses.
- `app/controllers/pages_controller.rb`: prepares the data to be displayed in the app.
- `app/views/layouts/application.html.erb`: defines links to CSS and JS files.
- `app/views/pages/*.html.erb`: define the HTML content of the app.
- `app/assets/stylesheets/*.css`: define how the app looks.
- `app/assets/javascripts/*.js`: define how the app behaves.
- `config/routes.rb`: defines which controllers would process which requests.
- `config/initializers/telegram.rb`, `config/application.rb`: configure the bot's token and host.
- `config/locales/*`: app's texts in English, Spanish, and Russian.
- `Dockerfile`, `docker-compose.yml`: Docker will use these files to build and launch this project.
- `Gemfile`: list of the project's dependencies to be installed by Docker.

There are other files in the app's directory, but they mostly contain boilerplate code and aren't required to understand how the project works.

## Backend organization

**Telegram client**. The project uses [telegram-bot](https://github.com/telegram-bot-rb/telegram-bot) gem to interact with Telegram API (in Ruby, code libraries are called "gems"). It's configured in `config/initializers/telegram.rb` which, in turn, uses environment variables from `.env` file (which was created during installation, step 4).

**No database is used**. For simplicity and ease of installation, this project doesn't use a database. Instead, the 10 demo words and their translations are defined in `app/models/word.rb`.

### Exception handling (backend)

This app communicates with Telegram API. If it's unavailable, exceptions will occur. Here's how we handle them:

- If configuring the chat menu button fails, we disable that functionality, but the user still can interact with the bot (`app/controllers/telegram_controller.rb:48`).
- If an unhandled exception occurs (e.g. Telegram API is unavailable), we respond with HTTP status 500 ("Internal Server Error").

Also, if the request doesn't contain the user's language code or we don't support it, we fallback to English (`app/controllers/telegram_controller.rb:35`).

## Frontend organization

**Single Page Application**. After the initial load, the app doesn't send requests to the backend anymore. So when the user clicks on a button they don't need to wait for the next page to load. The data is made available for the frontend at `app/views/pages/init.html.erb:5-9`.

**Application screens**. The app consists of three screens: `home`, `learning`, and `finished`. HTML for all of them is received during the initial load, but only `home` is visible on startup.

**Visual design of the app**. CSS files in `app/assets/stylesheets` folder describe the visual look of the app. You can read more about CSS [here](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

**Adjustment to user's color theme**. The app adjusts its look to match the user's color theme. This is defined at `app/views/layouts/application.html.erb:11` and `app/assets/stylesheets/base.css:16-23`.

**jQuery**. [jQuery](https://jquery.com) is a library we use to manipulate the elements of the page. We load jQuery at `app/views/layouts/application.html.erb:20`.

**Telegram API**. Interaction with Telegram API (e.g. configuring the Main button) is done by calling functions of `Telegram.WebApp` object. It becomes available by loading https://telegram.org/js/telegram-web-app.js script at `app/views/layouts/application.html.erb:8`.

**Structure of the JS scripts**. JS files in `app/assets/javascripts` folder define the app's behavior:

- `application.js`: defines app-level helper functions and initializes all the other objects.
- `home_screen.js`: defines event handlers for "choose language" buttons.
- `learning_screen.js`: assigns event handlers for the "No" button, and for Telegram's Main and Back buttons. Also, changes the look and behavior of Main button depending on the app's state.
- `finished_screen.js`: turns the `finished` screen to one of two states: either the user finished 5 words and could continue learning, or they finished all the words.
- `tutorial_popup.js`: we want to show a tutorial pop-up when the user taps the "No" button for the first time. Upon that, we store a flag in Telegram's CloudStorage and don't show the tutorial anymore.

### Exception handling (frontend)

The app interacts with Telegram API. Older Telegram clients don't support all the available methods, and also the API might be unavailable. In such cases, exceptions will occur. We handle them like that:

- We wrap the calls to `Telegram.WebApp.*` functions into `try/catch` blocks, gracefully disabling parts of the app's functionality. For example, if `Telegram.WebApp.BackButton.show()` function fails, the app will continue to be operational, just without the Back button.
- The Main button is crucial for the app's operation. If `Telegram.WebApp.MainButton.*` functions fail, we tell the user that interaction with Telegram client failed and suggest updating their Telegram client (`app/assets/javascripts/application.js:41`).
- If `Tutorial.init` and `Tutorial.onStorageReadResponse` functions fail, we fallback to assuming that the user has already seen the tutorial.
- If Telegram color variables are unavailable, we fallback to pre-defined default colors.

## App's interactions with Telegram API

- The bot responds to the `/start` command with a localized message with a button markup and also sets a localized chat menu button (see `app/controllers/telegram_controller.rb`).
- Changing style, text, color, and behavior of "Main" and "Back" Telegram buttons (e.g. at `app/assets/javascripts/learning_screen.js:111`).
- Adapting colors to match the user's color theme and light/dark mode (e.g. at `app/assets/stylesheets/base.css:16`).
- Reacting on resize and orientation change to stick the "No" button to the bottom of the screen (`app/assets/javascripts/learning_screen.js:6`).
- Haptic feedback (vibration) upon tapping on "Yes"/"No" buttons (`app/assets/javascripts/learning_screen.js:6`).
- Storing user's preferences in Telegram's CloudStorage (`app/assets/javascripts/learning_screen.js:15,48`).

The documentation for Telegram API and Telegram Mini Apps is available at https://core.telegram.org/bots/api and https://core.telegram.org/bots/webapps.

## Translations organization

This app is translated into English, Russian, and Spanish languages. Three types of texts are used in the app:

- In-app texts (`app/controllers/pages_controller.rb:22`, `config/locales/*.yml`);
- Bot's response (`app/controllers/telegram_controller.rb:21`);
- Bot's name, description, and short description;
  - Those could be configured by executing commands like `Telegram.bot.set_my_name(language_code: "es", name: name)` in the Rails console.


## Deployment of the app for production usage

The following steps were required to deploy [t.me/KeepInMemoryBot/app](https://t.me/KeepInMemoryBot/app
) non-locally:

- Rent a Linux server and a domain name;
- Obtain SSL certificates for that domain;
- Copy the code to the server, build the assets, launch Rails;
- Setup Nginx with HTTPS;
- Point the Telegram's WebApp to that server via [@BotFather](https://t.me/BotFather).

Particular commands will depend greatly on the deployment environment, so they aren't described here.

Also, it's worth noting that in production, it's a good practice to monitor exceptions to be able to react to issues faster.
