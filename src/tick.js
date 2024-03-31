import { is_date } from "./utils";

export function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
    const spring = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const accelaration = (spring - damper) * ctx.inv_mass;
    const d = (velocity + accelaration) * ctx.dt;

    if (
      Math.abs(d) < ctx.opts.precision &&
      Math.abs(delta) < ctx.opts.precision
    ) {
      return target_value; // settled, the animation should stop
    } else {
      ctx.settled = false; // signal loop to keep ticking
      return is_date(current_value)
        ? new Date(current_value.getTime() + d)
        : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) =>
      tick_spring(ctx, last_value[i], current_value[i], target_value[i])
    );
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(
        ctx,
        last_value[k],
        current_value[k],
        target_value[k]
      );
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
