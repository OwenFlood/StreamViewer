StreamViewer is an app where users can watch or participate in the chat of some of the top youtube livestreams. 
Most of the code explanation/reasoning is in comments amongst to code.

The app is made with a Rails API backend and a ReactJS Front End. It uses the Google OAuth and Youtube APIs to query and interact with videos.

Since the app was to be made in a short time period by one person, there were certain choices made to save time on things that would only be necessary in a real application. I have compiled a list of the things I would do differently with more time/necessity:
  - The client side router is currently rigid and not very clean. Using a library such as react-navigation would be much better for development and usability
  - The database is collecting minimal information. Simply adding more columns for tables like 'users' would make the db more useful if the app were to ever have other features, as right now it is just storing the email.
  - Currently, there is not much authentication for the API endpoints. The sessions are only maintained by the google OAuth cookie, and information about the user is only sent to be stored. An improvement would be to verify that the whoever hits the API is in the system. This can be implemented through Rails policies.
  - The YouTube chat is appending new messages indefinitely and the UX could be improved. Appending messages is only a minor issue, but could potentially slow down the page at a certain point. The User Experience of the chat could be improved by not resetting the scroll every time the chat refreshes, or having an indication that the chat is going to refresh after a few seconds.
  
Final Thoughts:
  - Working with third party APIs is always somewhat tedious and involves a lot of trial and error. Understanding the documentation was definitely the most difficult part of this project. Certain implementations I only found outside of the API documentation, making the process feel harder than it needed to be.
  - This project was a lot of fun to make and was really rewarding once all the stars aligned. Thanks for reading!