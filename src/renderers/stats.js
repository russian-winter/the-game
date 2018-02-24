
export default (context, game) => {
  const xPlayerPosition = game.player.position.x;
  const yPlayerPosition = game.player.position.y;
  const numOfObjects = game.world.objects.length;
  let cursorYPosition = 20;

  /**
  * Returns if the player can shoot at this moment
  */
  function renderString(string, xOffset = 0) {
    context.fillText(string, 10 + xOffset, cursorYPosition);
    cursorYPosition += 20;
  }

  /**
  * Returns if the player can shoot at this moment
  */
  function renderObject(obj, title) {
    renderString(title);

    Object.keys(obj).map(key => renderString(`${key}: ${obj[key]}`, 10));
  }

  /* eslint-disable no-param-reassign */
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.font = '18px Arial';
  /* eslint-disable no-param-reassign */

  renderString(`X: ${xPlayerPosition}`);
  renderString(`Y: ${yPlayerPosition}`);
  renderString(`N: ${numOfObjects}`);

  renderObject(game.player.playerActions, 'Player Actions');
};
