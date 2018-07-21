class SessionsController < ApplicationController
  def create
    # this is not a traditional session controller
    # it's basically just a way to make a new user
    # if the email is not registered yet
    if !User.find_by(email: email)
      User.create(email: email)
    end
    render json: {}, status: :ok
  end
  
  private
  
  def email
    params[:email]
  end
end