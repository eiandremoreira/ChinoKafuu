const Logger = require('../../structures/util/Logger')
const Bot = require('../../structures/Bot')

module.exports = class Cluster {
	constructor() {

		Logger.info('Online. Spawning shards...')
		if (process.env.PRODUCTION === 'true' && !process.env.MONGO_URI) {
			Logger.error('Production mode enabled without a database URI! Make sure MONGO_URI is in your .env file.')
		}
		if (process.env.PRODUCTION === 'false' && !process.env.MONGO_URI) {
			Logger.warning('Starting application without MONGO_URI in .env.')
		}
		this.spawnShards()
	}

	async spawnShards() {
		this.shardManager = new Bot(process.env.DISCORD_TOKEN, {
			firstShardID: 0,
			// lastShardID: this.firstClusterShardID + parseInt(process.env.SHARDS_PER_CLUSTER) - 1,
			maxShards: parseInt(process.env.SHARD_AMOUNT),
			defaultImageFormat: 'png',
			defaultImageSize: 2048,
			opusOnly: true,
			seedVoiceConnections: true,
			// intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BAN', 'GUILD_EMOJI', 'GUILD_WEBHOOKS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS']
		})

		try {
			await this.shardManager.connect().then(() => {
				Logger.info('Successfully connected to Discord\'s gateway.')
			})
		} catch (e) { }
	}

	get firstClusterShardID() {
		if (process.env.CLUSTER_ID === '0') return 0
		return parseInt(process.env.CLUSTER_ID) * parseInt(process.env.SHARDS_PER_CLUSTER)
	}
}