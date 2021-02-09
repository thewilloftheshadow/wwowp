const Discord = require("discord.js")
const db = require("quick.db")
const client = new Discord.Client()
require("dotenv").config()
const token = process.env.TOKEN
const prefix = process.env.PREFIX

client.on("ready", () => {
    console.log("Logged in!")
    client.user.setActivity("Werewolf Online World Playoffs", {type: "COMPETING"})
})


client.on("message", message => {

    if (message.author.bot) return
    if (message.content.toLowerCase().includes("fuck you")) return message.channel.send("bitch")
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    
    if (!message.content.startsWith(prefix)) return

    if (cmd == "setign") {
        if (args.length != 1) return message.channel.send("I am not THAT dumb you know")
        let allign = db.all().filter(data => data.ID.startsWith("ign")).sort()
        let sameign = false
        allign.forEach(e => {
            let tempign = db.get(e.ID)
            if (tempign == args[0]) {
                sameign = true
            }
        })
        if (sameign == true) {
            return message.channel.send("I know you may think I am dumb, but i know that this in game name has been taken!")
        }
        db.set(`ign_${message.author.id}`, args[0])
        message.channel.send("Done! Your ign is now: " + args[0])
    } else if (cmd == "leaderboard" || cmd == "lb") {
        return message.channel.send("Nope, not now. The tournament hasn't even started yet bish...")
        
        if (args.length != 2) return message.channel.send("Yo dic||tionary||khead, you need to state a group and the game")
        let group = args[0]
        let game = args[1]
        let t = db.all().filter(data => data.ID.startsWith("points") && data.ID.endsWith(`_${args[0]}_${args[1]}`)).sort((a, b) => b.data - a.data)
        let d = ""
        a = 0
        t.forEach(e => {
            a++
            let x = db.get(`${e.ID}`) || 0
            d += `${a}. ${client.users.cache.get(e.ID.split("_")[1])} - ${x}`
        })
        try {
            message.channel.send(d)
        } catch (e) {
            message.channel.send("Yo stupid, the leaderboard for this game hasn't been created yet. Come back later dingus.")
        }
        
    } else if (cmd == "setdesc") {
        
        let char = args.join(" ")
        if (char.length < 5 || char.length > 1000) return message.channel.send("This is a description. Meaning it should be **Descriptive** and not some random jumbly words.")
        db.set(`desc_${message.author.id}`, args.join(" "))
        message.channel.send("Done!")

    } else if (cmd == "addpoints" || cmd == "ap") {
        return message.channel.send("Nope, not now. The tournament hasn't even started yet bish...")
    } else if (cmd == "ping") {
        message.channel.send(`${client.ws.ping}ms - But why do you even care?`)
    } else if (cmd == "eval") {
        if (message.author.id != "552814709963751425") return;
        const clean = text => {
        if (typeof text !== "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      };
      try {

        const code = args.join(" ");
        let evaled = eval(code)
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled); 

        } catch (e) {
            return message.channel.send(e.message)
        }
  
      /* message.channel.send(new Discord.RichEmbed()
                           .setColor("#566848")
                           .addField("Code", `\`\`\`${code}\`\`\``)
                           .addField("Result", `\`\`\`${clean(evaled)}\`\`\``), {
        code: "xl"
      });*/
      message.delete();
    } else if (cmd == 'playerinfo' || cmd == "whois" || cmd == "userinfo") {
        if (args.length != 1) return message.channel.send("Just so you know, we just need 1 argument. Not more, not less.")
        let abc = false
        let allign = db.all().filter(data => data.ID.startsWith("ign")).sort()
        allign.forEach(e => {
            let t = db.get(e.ID)
            if (t == args[0]) {
                abc = client.users.cache.get(e.ID.split("_")[1]).id
                if (!abc) {
                    abc = false
                }
            }
        })
        if (abc == false) {
            return message.channel.send("Player not found!")
        }
        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle(args[0])
            .setDescription(`Description: ${db.get(`desc_${abc}`) || "I am a nerd coz i don't like putting descriptions"}`)
            .setColor("#008800")
            .addFields([
                {name: "Games Played", value: `${db.get(`gamesplayed_${abc}`) || 0}`},
                {name: "Group", value: db.get(`group_${abc}`) || 0},
                {name: "Games Won", value: db.get(`wins_${abc}`) || 0 },
                {name: "Games Lost", value: db.get(`loses_${abc}`) || 0},
                {name: "Leaderboard in Group", value: "Hidden"},
            ])
        )
    } else if (cmd == "allign") {
        try {

            let t = db.all().filter(c => c.ID.startsWith("ign")).sort()
            let a = ""
            t.forEach(e => {
            
            a += `${client.users.cache.get(e.ID.split("_")[1]).tag.replace("\_", "\\_")} - \`${db.get(e.ID).replace(/_/g, "\_").replace(/\*/g, "\*")}\`\n`
            
            })
            
            message.channel.send(a) } catch (e) {message.channel.send(e.message)}
    }

})

client.login(token)