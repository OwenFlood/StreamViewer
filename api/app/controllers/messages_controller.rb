class MessagesController < ApplicationController
  before_action :find_user

  def create
    # binding.pry
    message = params[:message]
    # create Message table
    # create new Message with param
    
    render json: {}, status: :ok
  end
  
  private
  
  def find_user
    # I can un-comment this once the user model exists
    # @user ||= User.find_by_email(params[:email])
  end
end