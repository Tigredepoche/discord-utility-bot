const Discord = require('discord.js');
const bot = new Discord.Client({
  partials: ['MESSAGE', 'REACTION'],
});
const fetch = require('node-fetch');
const { token, clientID, oauth } = require('./config.json');

bot.once('ready', async () => {
  console.log('Ready!');
  const url = 'https://api.twitch.tv/helix/streams/?user_login=tigre_de_poche';

  const options = {
    headers: {
      Authorization: oauth,
      'Client-ID': clientID,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let streamtime;
      setInterval(() => {
        // console.log(data);
        if (data.data[0] === undefined) {
          streamtime = '';
          return console.log('No stream');
        }
        if (streamtime === data.data[0].started_at) {
          console.log('stream already shared');
        } else {
          const channel = bot.channels.cache.get('720782948613488701');

          const embedStream = new Discord.MessageEmbed()
            .setColor('#6a0dad')
            .setTitle(
              `Titre: ${data.data[0].title} | Jeu: ${data.data[0].game_id}`
            )
            .setURL('https://twitch.tv/tigre_de_poche')
            .setAuthor(
              `Tigre de poche est en stream : https://twitch.tv/tigre_de_poche`,
              'https://static-cdn.jtvnw.net/jtv_user_pictures/tigre_de_poche-profile_image-ec2951207204f8ed-70x70.png',
              'https://twitch.tv/tigre_de_poche'
            )
            .setThumbnail(
              `https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.data[0].user_name.toLowerCase()}-640x360.jpg`
            )
            .setTimestamp()
            .setFooter('Il faut venir !!!');

          channel.send(embedStream);
          streamtime = data.data[0].started_at;
          console.log(streamtime);
        }
      }, 120000);
    });
});

const Yard = '720411726830370928';
const MessageNumber = '720413679299985458';

bot.on('message', async (message) => {});

bot.on('messageReactionAdd', async (reaction, user) => {
  console.log('Message Reaction Add Top');

  const applyRole = async () => {
    const emojiName = reaction.emoji.name;
    const role = reaction.message.guild.roles.cache.find;
    const member = reaction.message.guild.members.cache.find(
      (member) => member.id == user.id
    );
    if (role && member) {
      console.log('Role and Member Found');
      await member.roles.add(Yard);
    }
  };
  if (reaction.message.partial) {
    try {
      const msg = await reaction.message.fetch();
      console.log(msg.id);
      if (msg.id === MessageNumber) {
        console.log('Cached - Applied');
        applyRole();
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log('Not a Partial');
    if (reaction.message.id === MessageNumber) {
      console.log('Not a Partial - applied');
      applyRole();
    }
  }
});

bot.login(token);
