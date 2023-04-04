require('dotenv').config();

const fs = require('fs');

const { Client, Collection, Intents, GatewayIntentBits, PermissionsBitField, EmbedBuilder, DiscordAPIError, CommandInteraction } = require("discord.js");
const { get } = require("needle");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


const needle = require('needle');

const monthNames = ["january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];


// Creation de commandes



// Reponse "Heure du Duel"


client.on("messageCreate", message => {
    if (message.author.bot) return;
    
    if (message.content === `!heure`){
        message.reply("C'est l'heure du Duel ! \nhttps://tenor.com/view/yu-gi-oh-time-to-duel-card-gif-12403495"
        );
    }
}
);


// Banlist TCG

let timestopbl=true;
let repetbl=true;
const idsalonnewstcg="964907351637368832"; // Mettre ID du salon des news


client.on("ready", message=>{
    console.log('Bot pret.')
    setInterval( function(){
        let sitekonami="https://www.yugioh-card.com/fr/limited/";
        needle.get(sitekonami, (error, response) => {
            let date = new Date();
            var dateajd = new Date(date.getFullYear()+'-'+monthNames[date.getMonth()]+'-'+date.getDate());
            let text = response.body;
            let avt= text.indexOf("Effectif du ");
            var eff=text.substring(avt+12);
            let ap= eff.indexOf('</h2>');
            eff=eff.substring(0,ap);
            var dateeff=new Date(eff.substring(6,10)+'-'+eff.substring(3,5)+'-'+eff.substring(0,2));
        
            if(timestopbl){
                if(dateeff>=dateajd){
                   if (repetbl){}
                   else
                    {timestopbl=false;}
                }
                else{repetbl=false;}
            }
            else {
                const embed = new EmbedBuilder()
                        .setColor("#e60026")
                        .setTitle("Nouvelle BanList !")
                        .setURL(sitekonami)
                        .setDescription("Konami a encore frappé ! Venez découvrir quelles sont les cartes bannies et limitées ! \n")
                        .setImage("https://static.wikia.nocookie.net/yugioh-gx/images/6/6f/Prohibition.jpg/revision/latest?cb=20131208095912&path-prefix=fr");
                    client.channels.cache.get(idsalonnewstcg).send({embeds:[embed]})} 
                timestopbl=true;
                repetbl=true;
            }
        )
        }
        ,1000)
    }
);

// News Duel Links Meta
let timestopdlm=false;
const idsalonnewsdlm="993787860048150569"; // Mettre ID du salon des news

client.on("ready", message=>{
    setInterval( function(){
        let date = new Date();
        // Send date
        let content = 'https://www.duellinksmeta.com/articles/news/' + monthNames[date.getMonth()] + '-' + date.getFullYear()+ '/datamined-leaks-' + date.getDate();
        needle.get(content, (error, response) => {
        let text = response.body;
        if((text.includes("Page not found"))||timestopdlm){        
            let date = new Date();
            if (date.getHours() ===1){timestopdlm=false;}
    }
            else {timestopdlm=true;
                let avt= text.indexOf('<meta property=\u0022og:image\u0022 content=\u0022');
                var img=text.substring(avt+35);
                let ap= img.indexOf('\u0022 data-svelte=\u0022');
                img=img.substring(0,ap);

                if(text.includes("Main Box")){
                    const embed = new EmbedBuilder()
                        .setColor("#001427")
                        .setTitle("Duel Links News !")
                        .setURL(content)
                        .setDescription("Une nouvelle Main Box va faire parler d'elle ! \n")
                        .setImage(img);
                    client.channels.cache.get(idsalonnewsdlm).send({embeds:[embed]})} 
                else if(text.includes("Mini Box")){
                        const embed = new EmbedBuilder()
                            .setColor("#001427")
                            .setTitle("Duel Links News !")
                            .setURL(content)
                            .setDescription("Une nouvelle Mini Box arrive bientôt ! \n")
                            .setImage(img);
                        client.channels.cache.get(idsalonnewsdlm).send({embeds:[embed]})} 
                    else {
                            const embed = new EmbedBuilder()
                                .setColor("#001427")
                                .setTitle("Duel Links News !")
                                .setURL(content)
                                .setDescription("Des nouveautés révélées ! \n")
                                .setImage(img);
                            client.channels.cache.get(idsalonnewsdlm).send({embeds:[embed]})} 
                    }
            })
        }
        ,1000
        );
        }
    );

// Master Duel Meta

let timestopmdm=false;
const idsalonnewsmdm="993789778833195138"; // Mettre ID du salon des news

client.on("ready", message=>{
    setInterval( function(){
        let date = new Date();
        // Send date
        let content = 'https://www.masterduelmeta.com/articles/news/'+monthNames[date.getMonth()] + '-' + date.getDate() + '-' +date.getFullYear()+'/master-duel-datamines'
        needle.get(content, (error, response) => {
        let text = response.body;
        if((text.includes("Page not found"))||timestopmdm){        
            let date = new Date();
            if (date.getHours() ===1){timestopmdm=false;}
        }
            else {timestopmdm=true;
                let avt= text.indexOf('<meta property=\u0022og:image\u0022 content=\u0022');
                var img=text.substring(avt+35);
                let ap= img.indexOf('\u0022 data-svelte=\u0022');
                img=img.substring(0,ap);



                const embed = new EmbedBuilder()
                                .setColor("#5c3a93")
                                .setTitle("Master Duel News !")
                                .setURL(content)
                                .setDescription("De nouveaux ajouts ! \n")
                                .setImage(img);
                client.channels.cache.get(idsalonnewsmdm).send({embeds:[embed]})} 
                    })
            }        ,1000
            );
        }
        );


client.login(process.env.TOKEN);
