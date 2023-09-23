source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

gem "rails", "~> 7.0.8"

gem "dotenv-rails", "~> 2.8"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails", "~> 3.4"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", "~> 1.16", require: false

gem "puma", "~> 6.4"

# using latest version so that all API methods are available
gem "telegram-bot", github: "telegram-bot-rb/telegram-bot"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "pry-rails"
end
