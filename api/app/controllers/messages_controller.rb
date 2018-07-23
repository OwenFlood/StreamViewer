class MessagesController < ApplicationController
  before_action :find_user

  def create
    Message.create(
      text: params[:message],
      user_id: @user.id,
    )
    
    render json: {}, status: :ok
  end
  
  private
  
  def find_user
    @user ||= User.find_by_email(params[:current_user])
  end
end