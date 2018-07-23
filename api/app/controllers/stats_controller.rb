class StatsController < ApplicationController
  def index
    messages = Message
                .where(video_id: params[:video_id])
                .joins(:user)
                .where(
                  'text LIKE ? OR users.email LIKE ?',
                  "%#{params[:filter]}%",
                  "%#{params[:filter]}%"
                )
    
    render json: {
      messages: messages.map { |message| { 
        text: message.text,
        created_at: message.created_at,
        author: message.user.email
      }}
    }, status: :ok
  end
end