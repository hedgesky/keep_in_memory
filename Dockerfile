FROM ruby:3.2.2

# Upgrade RubyGems and install the latest Bundler version
RUN gem update --system && gem install bundler -v 2.4.10

RUN mkdir -p /app
WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]
