require('dotenv').config();

const fs = require('fs');

const { Client, Collection, Intents, GatewayIntentBits, PermissionsBitField, EmbedBuilder, DiscordAPIError, CommandInteraction } = require("discord.js");
const { get } = require("needle");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


const needle = require('needle');

const monthNames = ["january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];


// Creation de commandes

client.on("messageCreate", message => {
    if (message.author.bot) return;
   
    if (message.content === `!heure`){
        message.reply("C'est l'heure du Duel ! \nhttps://tenor.com/view/yu-gi-oh-time-to-duel-card-gif-12403495"
        );
    }
}
);

// News YUGIOH
 

client.on("ready", message=>{
    console.log("prêt");

    // Timers
    var timestopduellinks=false;
    var timestopban=true;
    var timestopmd=false;
    var timestopcd=false;
    var repetban=true;

    // ID des salons des news
    var idsalonnewstcg="964907351637368832"; 
    var idsalonnewsdl="993787860048150569"; 
    var idsalonnewsmd="993789778833195138"; 
    var idsalonnewscd="993789979371249745"; 

    var sitekonami="https://www.yugioh-card.com/fr/limited/";

    setInterval( function(){
        var date = new Date(); // Send date
        var jour= ""+date.getDate();

        if (jour.length==1){var contentdl = 'https://www.duellinksmeta.com/articles/news/' + monthNames[date.getMonth()] + '-' + date.getFullYear()+ '/datamined-leaks-0' + jour;
        var contentmd = 'https://www.masterduelmeta.com/articles/news/'+monthNames[date.getMonth()] + '-0' + jour + '-' +date.getFullYear()+'/master-duel-datamines';
        var contentcd = 'https://www.masterduelmeta.com/articles/news/'+monthNames[date.getMonth()] + '-0' + jour + '-' +date.getFullYear()+'/master-duel-datamines';
        }
        else{var contentdl = 'https://www.duellinksmeta.com/articles/news/' + monthNames[date.getMonth()] + '-' + date.getFullYear()+ '/datamined-leaks-' + jour;
        var contentmd = 'https://www.masterduelmeta.com/articles/news/'+monthNames[date.getMonth()] + '-' + jour + '-' +date.getFullYear()+'/master-duel-datamines';
        var contentcd = 'https://www.masterduelmeta.com/articles/news/'+monthNames[date.getMonth()] + '-' + jour + '-' +date.getFullYear()+'/master-duel-datamines';
        };

        // Duel Links
        needle.get(contentdl, (error, response) => {
            var textdl = response.body;
            if((textdl.includes("Page not found"))||timestopduellinks){        
                if (date.getHours() ===1){timestopduellinks=false;}
                else {timestopduellinks=true}
                }
            else {timestopduellinks=true;   ;
 
                var avtdl= textdl.indexOf('<meta property=\u0022og:image\u0022 content=\u0022');
                var imgdl=textdl.substring(avtdl+35);
                var apdl= imgdl.indexOf('\u0022 data-svelte=\u0022');
                imgdl=imgdl.substring(0,apdl);
 
                    var embeddl = new EmbedBuilder()
                        .setColor("#001427")
                        .setTitle("Duel Links News !")
                        .setURL(contentdl)
                        .setDescription("Viens voir les news ici ! \n")
                        .setImage(imgdl);
                    client.channels.cache.get(idsalonnewsdl).send({embeds:[embeddl]})};})

        // BanList
        needle.get(sitekonami, (error, response) => {
             var dateajd = new Date(date.getFullYear()+'-'+monthNames[date.getMonth()]+'-'+date.getDate());
             var textban = response.body;
             var avtban= textban.indexOf("Effectif du ");
             var effban=textban.substring(avtban+12);
             var apban= effban.indexOf('</h2>');
             effban=effban.substring(0,apban);
             var dateeffban=new Date(effban.substring(6,10)+'-'+effban.substring(3,5)+'-'+effban.substring(0,2));
        
            if(timestopban){
                if(dateeffban>=dateajd){
                   if (repetban){}
                   else
                    {timestopban=false;}
                }
                else{repetban=false;}
            }
            else {
                var embedban = new EmbedBuilder()
                        .setColor("#e60026")
                        .setTitle("Nouvelle BanList !")
                        .setURL(sitekonami)
                        .setDescription("Konami a encore frappé ! Venez découvrir quelles sont les cartes bannies et limitées ! \n")
                        .setImage("https://static.wikia.nocookie.net/yugioh-gx/images/6/6f/Prohibition.jpg/revision/latest?cb=20131208095912&path-prefix=fr");
                    client.channels.cache.get(idsalonnewstcg).send({embeds:[embedban]})
                    timestopban=true;
                    repetban=true;
                }
        })

        // Master Duel
        needle.get(contentmd, (error, response) => {
            var textmd = response.body;
            if((textmd.includes("Page not found"))||timestopmd){        
                if (date.getHours() ===1){timestopmd=false;}
            }
           else {timestopmd=true;
               var avtmd= textmd.indexOf('<meta property=\u0022og:image\u0022 content=\u0022');
               var imgmd=textmd.substring(avtmd+35);
               var apmd= imgmd.indexOf('\u0022 data-svelte=\u0022');
               imgmd=imgmd.substring(0,apmd);

               var embedmd = new EmbedBuilder()
                               .setColor("#5c3a93")
                               .setTitle("Master Duel News !")
                               .setURL(contentmd)
                               .setDescription("De nouveaux ajouts ! \n")
                               .setImage(imgmd);
               client.channels.cache.get(idsalonnewsmd).send({embeds:[embedmd]})}
        })

        // Cross Duel

        needle.get(contentcd, (error, response) => {
            var textcd = response.body;
            if((textcd.includes("Page not found"))||timestopcd){        
                if (date.getHours() ===1){timestopcd=false;}
            }
                else {timestopcd=true;
                    var avtcd= textcd.indexOf('<meta property=\u0022og:image\u0022 content=\u0022');
                    var imgcd=textcd.substring(avtcd+35);
                    var apcd= imgcd.indexOf('\u0022 data-svelte=\u0022');
                    imgcd=imgcd.substring(0,apcd);
     
                    const embedcd = new EmbedBuilder()
                                    .setColor("#ff8000")
                                    .setTitle("Cross Duel News !")
                                    .setURL(contentcd)
                                    .setDescription("Des nouveautés ! \n")
                                    .setImage(imgcd);
                    client.channels.cache.get(idsalonnewscd).send({embeds:[embedcd]})}
        })    
    }
    ,1000*3600);
}
);




client.login(process.env.TOKEN);
