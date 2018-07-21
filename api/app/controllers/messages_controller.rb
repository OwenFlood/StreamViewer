class MessagesController < ApplicationController
  before_action :find_user

  def create
    Message.create(
      message: params[:message],
      user_id: @user.id,
    )
    
    render json: {}, status: :ok
  end
  
  private
  
  def find_user
    @user ||= User.find_by_email(params[:email])
  end
end