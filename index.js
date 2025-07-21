const POWER_ID = [
    "1391411447287775344",
    "1237161684385140807"
];
const POWER_USRNAME = [
    "cookie_40537",
    "biscgames"
];

const fs = require('fs');
const token = process.env.BOT_TOKEN;
const { Client, Events, GatewayIntentBits } = require("discord.js");
let cookies = {bank:{}};

function saveData() { // Save current cookie session
    if (!fs.existsSync("/tmp")) {
        fs.mkdirSync("/tmp");
    }
    fs.writeFileSync("/tmp/userdata.json",JSON.stringify(cookies,null,8));
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady,c=>{
    console.log(`Ready from ${c.user.tag}`);
    if (!cookies.bank) cookies.bank = {};
});
client.on(Events.MessageCreate,async(msg)=>{
    if (msg.author.bot) return;
    if (msg.content[0]!=="!") return;

    const serverID = msg.guildId;
    if (!cookies[serverID]) cookies[serverID] = {};
    const serverCookies = cookies[serverID];

    function cookieCheck(userID) { // If userID isn't available, make the key!
        if (!serverCookies[userID]) serverCookies[userID] = 0;
    }
    function bankCheck(userID) {
        if (!cookies.bank[userID]) cookies.bank[userID] = 1000;
    }

    let args = msg.content.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
    let command = args[0];
    args.shift();

    // Misc commands
    if (command === "!ping") {
        msg.reply("Pong!");
    }
    if (command === "!echo") {
        args.forEach(s=>msg.reply(s));
    }

    if (command === "!cookie") {
        cookieCheck(msg.author.id);
        bankCheck(msg.author.id);

        if (!msg.reference) {
            msg.reply("❌: Try replying to someone using that command!");
            return
        }
        let ref = await msg.channel.messages.fetch(msg.reference.messageId);
        
        if (serverCookies[msg.author.id]<1) {
            msg.reply("You don't have any cookies!"+(cookies.bank[msg.author.id]>0?` (Psssst, you have ${cookies.bank[msg.author.id]} cookies in your bank, consider withdrawal? Use !withdraw <number|all>)`:""));
            return;
        }
        serverCookies[msg.author.id] -= 1;
        cookieCheck(ref.author.id);
        serverCookies[ref.author.id] += 1;
        msg.channel.send(`🍪 ${msg.author} gave ${ref.author} a cookie!`);
    }
    if (command === "!deposit") {
        cookieCheck(msg.author.id);
        bankCheck(msg.author.id);
        if (serverCookies[msg.author.id]<1) {
            msg.reply("You're all caught up! You don't have any cookies to deposit.");
            return;
        }
        if (args.length<1) {
            msg.reply("❌: Expected one argument");
            return;
        }
        if (args.length>1) {
            msg.reply(`⚠️: ${args.length-1} more arguments than expected! Excess arguments will be ignored`);
        }
        if (isNaN(args[0])&&args[0]!=="all") {
            msg.reply("❌: Expected first argument to be number or keyword all");
            return;
        }
        if (args[0]=="all") {
            cookies.bank[msg.author.id] = serverCookies[msg.author.id]
            serverCookies[msg.author.id] = 0;
        } else {
            cookies.bank[msg.author.id] += Number(args[0]);
            serverCookies[msg.author.id] -= Number(args[0]);
        }
        msg.channel.send(`🍪 Deposited ${args[0]} cookie${(!isNaN(args[0])?Number(args[0]):2)!=1?"s":""} to the bank!`);
    }
    if (command === "!withdraw") {
        cookieCheck(msg.author.id);
        bankCheck(msg.author.id);
        if (cookies.bank[msg.author.id]<1) {
            msg.reply("You're all caught up! You don't have any cookies in bank to withdraw.");
            return;
        }
        if (args.length<1) {
            msg.reply("❌: Expected one argument");
            return;
        }
        if (args.length>1) {
            msg.reply(`⚠️: ${args.length-1} more arguments than expected! Excess arguments will be ignored`);
        }
        if (isNaN(args[0])&&args[0]!=="all") {
            msg.reply("❌: Expected first argument to be number or keyword all");
            return;
        }
        if (args[0]=="all") {
            serverCookies[msg.author.id] = serverCookies[msg.author.id]
            cookies.bank[msg.author.id] = 0;
        } else {
            serverCookies[msg.author.id] += Number(args[0]);
            cookies.bank[msg.author.id] -= Number(args[0]);
        }
        msg.channel.send(`🍪 Withdrawn ${args[0]} cookie${(!isNaN(args[0])?Number(args[0]):2)!=1?"s":""} from the bank!`);
    }
    if (command === "!bal") {
        let ref
        if (msg.reference) {
            ref = await msg.channel.messages.fetch(msg.reference.messageId)
        }
        let author = !ref?msg.author:ref.author
        let authorID = author.id
        cookieCheck(authorID);
        bankCheck(authorID);
        msg.channel.send(`${author}\n#- ${authorID}\n🏦 **${cookies.bank[authorID]}**\n🍪 **${serverCookies[authorID]}**\nNote that if the server restarts it'll all be wiped due to a plan without access to a presistent disk`);
    }
    if (command === "!shutdown") {
        if (!POWER_ID.includes(msg.author.id)) {
            msg.channel.send("Only the users with the administrator ids can use that command!\nUse !adminid to list all user ids!");
            return;
        }
        saveData();
        process.exit(0);
    }
    if (command === "!selfcookie") {
        if (!POWER_ID.includes(msg.author.id)) {
            msg.channel.send("Only the users with the administrator ids can use that command!\nUse !adminid to list all user ids!");
            return;
        }
        cookieCheck(msg.author.id);
        let cookiesToAdd = args.length>0?(!isNaN(args[0])?Number(args[0]):1):1;
        serverCookies[msg.author.id] += cookiesToAdd;
        msg.reply(`🍪 You've accquired ${cookiesToAdd} cookie${cookiesToAdd!=1?"s":""}!`);
    }
    if (command === "!adminid") {
        let stringList = "**Here's the bot admin list:**\n"
        for (let i in POWER_ID) {
            stringList += `${POWER_ID[i]} (${POWER_USRNAME[i]})\n`;
        }
        msg.channel.send(stringList);
    }
    if (command === "!help") {
        msg.reply("Hello! [Please read the github readme for a list of commmands here!](https://github.com/biscgames/cookiebotjs/blob/main/README.md)")
    }
})

client.login(token);
