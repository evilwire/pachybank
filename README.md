== README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


Please feel free to use a different markup language if you do not plan to run
<tt>rake doc:app</tt>.

The Guardfile has been updated to accommodate for Red/Green dev cycles. Pull, merge, then move the guard file before doing bundle install, so as not to insert duplicate watches to the guard file.

The dev environments are setup to use RSpec+Guard+Spork. 

To start guard:
<tt>bundle exec guard</tt> (or just <tt>guard</tt> if you have rvm installed and updated)

To start spork (in a separate terminal):
<tt>bundle exec spork</tt> (or just <tt>spork</tt>)

* Edited the .rspec file to run spork automatically when running <tt>rspec</tt>.
