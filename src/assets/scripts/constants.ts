import { ground } from "./game/motor/variables";

export class Constants {
	public static readonly CHARACTER_HEIGHT = 100;
	public static readonly CHARACTER_WIDTH = 100;
	public static readonly GRAVITY = 4;
	public static readonly MAX_SPEED_X = 5;
	public static readonly MAX_SPEED_Y = 12;
	public static readonly ENEMY_MOVE_SPEED = 2;
	public static readonly GROUND = ground - 82;
	public static readonly JUMPER_INTERVAL = 1000;
	public static readonly ANIMATION_UPDATE = 100;
	public static readonly MOVEMENT_UPDATE = 95;
	public static readonly INITIAL_LIFES = 4;
	public static readonly HEART_SIZE = 25;
	public static readonly FONT_FAMILY = "Georgia";
	public static readonly CH_INITIAL_X = 100;
	public static readonly CH_INITIAL_Y = ground - 250;
}
