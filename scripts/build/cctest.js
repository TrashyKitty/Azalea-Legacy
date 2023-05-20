function CustomCommandTest(requestPermissions, commandAPI, sentBy) {
    requestPermissions(commandAPI, sentBy, "FULL-MINECRAFT-API");
    sentBy.sendMessage("Best custom commands");
}
