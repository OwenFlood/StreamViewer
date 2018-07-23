class AddVideoIdToMessages < ActiveRecord::Migration[5.1]
  def change
    add_column :messages, :video_id, :string
  end
end
