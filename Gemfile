source 'https://rubygems.org'

gem 'rails', '~> 4.0'
gem 'puma'
gem 'pg', "< 1"
gem 'state_machine'
gem 'haml'
gem 'inherited_resources'
gem 'has_scope'
gem 'devise', "~> 3.1"
gem 'protected_attributes'
gem 'rails_admin', '~> 0.5'
gem 'yajl-ruby'
gem 'utilities', "0.0.7"
gem 'kaminari'
gem "delayed_job"
gem 'delayed_job_active_record'
gem 'uuidtools', '2.1.3'
gem "typhoeus"
gem 'daemons'
gem 'active_model_serializers', '~> 0.8.1'
gem 'foreman'

# Compatibility issues
# https://stackoverflow.com/questions/60226893/rails-nomethoderror-undefined-method-new-for-bigdecimalclass
# gem 'bigdecimal', '1.3.5'

group :development do
  gem 'capistrano', '~> 2.15.5', require: false
  gem 'capistrano_colors', require: false
  gem 'capistrano-unicorn', require: false
  gem 'quiet_assets'
  gem 'bullet'
  gem 'pry'
end

group :assets do
  gem 'sass-rails'
  gem 'coffee-rails', '~> 4.0.0'
  gem 'uglifier'

  # gem 'therubyracer', :platforms => :ruby
end

group :test do
  gem 'mocha', :require => false
end
