# cookiebotjs
**config.json**: Token key allows access to your bot. I've removed my token before uploading to github because it's my bot and you're not going to touch cookiebot to raid servers or spam nsfw links which cookiebot shouldn't and will never do
<br/>**userdata.json**: The bank key is a global bank of cookies. depositing cookies allows you to takes your cookies to any server you'd like. The guildID keys hold the balance of all users' withdrawn cookies.
<br/>**index.js**: The script itself. It's very self explanatory on what it's supposed to do
<br/>
Reminder that this is for NodeJS environments only!
<br/>

**Commands** (The prefix ! is used; if you have any clashing bots with the same prefix, I recommend trying to change that.):
<br/>
**!ping**: replies pong; tests the bot state and permissions<br/>
**!echo <arg>**: replies with recieved argument; tests the argument system<br/>
**!cookie**: use this command while replying to someone to give them a cookie from your withdrawn amount.<br/>
**!deposit <amount|all>**: use this command to deposit pocket cookies to the cookie bank; your cookies are safe and totally isn't stored in an unecrypted json file.<br/>
**!withdraw <amount|all>**: use this command to withdraw bank cookies!<br/>
**!bal**: use this alone to get your balance in the bank and in the server
**!shutdown**: shuts down the bot safely; this saves data to the mentioned userdata.json file making this the safe way since only users with their userid on the admin list can use this
**!selfcookie [amount\]**: gives free cookies! you can get either 1 cookie or get an amount of cookies using the optional argument! (Only those with their userid on the list can use this)
**!adminid**: lists all IDs that can use certain commands (like !shutdown or !selfcookie)<br/>
**!addadmin <id> [username\]**: gives a user access to certain commands like !shutdown and !selfcookie! you can also give it an optional argument for username so it'll show up in !adminid!
