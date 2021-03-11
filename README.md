# HomeOs

A webserver for on my raspberry pi to control various home appliances.

## Another one?

Yes... The old one is written using Flask. This time i'm doing it with Django and planning on making it better and more expandable.

## Todo

- [X] Encrypt passwords using bctypt
- [X] Programs pages
- [X] Clean up views.py
- [X] New?
  - [X] New event from UI?
  - [X] Delete event from UI?

- [X] Schedular
- [X] Api authentication
- [X] Get device programs from device on device start
- [X] Template database on first start (Lol already did that appareantly)
- [X] Register for new users
- [ ] Set up actions ( previously programs )
  - [X] Find a way to do it
  - [X] Implement it
  - [ ] Visual feedback for starting an action
- [X] Multiple device login

- [X] Admin pannel
  - [X] UI
  - [X] route
  - [X] Get database info from backend
  - [X] Save to backend
  - [X] Array support
  - [X] Add items
  - [X] Remove items
  - [X] Change programs
  - [X] Change users data
  - [X] Add admin panel to frontend server routes

- [X] Messaging
  - [X] Error message in stead of alert()
  - [X] Message to notify the user

- [X] arrayRemove is defined but never used admn.js:10:8
- [X] Do not mutate state directly. Use SetState() admin.js:190:9
- [X] Allow API calls to routes
- [X] Do the actual device call
- [X] Add register page to frontend_server routes
- [X] Don't add user when passwords don't match
- [X] Rename button on register page to register in stead of 'login'
- [X] Visual feedback on action trigger
