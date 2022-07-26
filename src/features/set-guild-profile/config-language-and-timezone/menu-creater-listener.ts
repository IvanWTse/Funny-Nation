import client from '../../../client'
import { GuildMember, Interaction, MessageActionRow, MessageButton } from 'discord.js'
import { DBGuild } from '../../../models/db-guild'
import getDbGuild from '../../../models/db-guild/get-db-guild'
import getLanguage from '../../../language/get-language'
import getLanguageSettingMessageActionRow from './factories/get-language-setting-message-action-row'
import getTimeZoneSettingMessageActionRow from './factories/get-time-zone-setting-message-action-row'
import isAdmin from '../../../utils/is-admin'

/**
 * Listener for creating
 */
client.on('interactionCreate', async (interaction: Interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.guild === null ||
    !(interaction.member instanceof GuildMember)
  ) return

  const dbGuild: DBGuild = await getDbGuild(interaction.guild.id)
  const language = getLanguage(dbGuild.languageInGuild)
  if (interaction.commandName !== language.setGuildProfile.command || interaction.options.getSubcommand() !== 'lt') return

  if (!await isAdmin(interaction.member)) {
    await interaction.reply('You don\'t have permission')
  }

  const languageSettingRow = getLanguageSettingMessageActionRow(dbGuild.languageInGuild)

  const timeZoneSettingRow = getTimeZoneSettingMessageActionRow(dbGuild.languageInGuild, dbGuild.timeZone)

  const closeButton = new MessageActionRow()
    .addComponents([
      new MessageButton()
        .setCustomId('LanguageTimeZoneSettingCloseMenuButton')
        .setLabel('Close')
        .setStyle('SECONDARY')
    ])

  await interaction.reply({
    content: language.setGuildProfile.title,
    components: [languageSettingRow, timeZoneSettingRow, closeButton]
  })
})