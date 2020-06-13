const Discord = require('discord.js');
const bot = new Discord.Client({
  partials: ['MESSAGE', 'REACTION'],
});
const fetch = require('node-fetch');
const { token, clientID, oauth } = require('./config.json');
const twitchChannelName = 'tigre_de_poche';
const avatar =
  'https://static-cdn.jtvnw.net/jtv_user_pictures/tigre_de_poche-profile_image-ec2951207204f8ed-70x70.png';

bot.once('ready', async () => {
  console.log('Ready!');

  // Idk if its the best to put this there, but it's a very basic bot so i guess it work
  const url = `https://api.twitch.tv/helix/streams/?user_login=${twitchChannelName}`;

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
          return console.log('stream already shared');
        }
        const channel = bot.channels.cache.get('720778140560916552');

        const embedStream = new Discord.MessageEmbed()
          .setColor('#6a0dad')
          .setTitle(`Titre: ${data.data[0].title}`)
          .setURL(`https://twitch.tv/${twitchChannelName}`)
          .setAuthor(
            `${
              twitchChannelName.charAt(0).toUpperCase() +
              twitchChannelName.slice(1)
            } est en stream : https://twitch.tv/${twitchChannelName}`,
            avatar,
            `https://twitch.tv/${twitchChannelName}`
          )
          .setThumbnail(
            `https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.data[0].user_name.toLowerCase()}-640x360.jpg`
          )
          .setTimestamp()
          .setFooter('Il faut venir !!!');

        channel.send(embedStream);
        streamtime = data.data[0].started_at;
        console.log(streamtime);
      }, 120000);
    });
});

// Add role by adding a react to message

// Put the role ID there
const Yard = '720411726830370928';
// Put the message ID you want to watch
const MessageNumber = '720413679299985458';

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
