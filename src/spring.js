import { tick_spring } from "./tick";
import { loop, raf } from "./timing";

Alpine.data(
  "spring",
  (value, { stiffness = 0.15, damping = 0.8, precision = 0.01 } = {}) => {
    let last_time;
    let task;
    let current_token;
    let last_value = value;
    let target_value = value;

    let inv_mass = 1;
    let inv_mass_recovery_rate = 0;
    let cancel_task = false;

    function set(new_value, opts = {}) {
      target_value = new_value;
      const token = (current_token = {});
      if (
        value == null ||
        opts.hard ||
        (this.stiffness >= 1 && this.damping >= 1)
      ) {
        cancel_task = true; // cancel any running animation
        last_time = raf.now();
        last_value = new_value;
        this.value = value = target_value;
        return Promise.resolve();
      } else if (opts.soft) {
        const rate = opts.soft === true ? 0.5 : +opts.soft;
        inv_mass_recovery_rate = 1 / (rate * 60);
        inv_mass = 0; // infinite mass, unaffected by spring forces
      }

      if (!task) {
        last_time = raf.now();
        cancel_task = false;
        task = loop((now) => {
          if (cancel_task) {
            cancel_task = false;
            task = null;
            return false;
          }
          inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
          const ctx = {
            inv_mass,
            opts: this,
            settled: true,
            dt: ((now - last_time) * 60) / 1000,
          };

          const next_value = tick_spring(ctx, last_value, value, target_value);
          last_time = now;
          last_value = value;
          this.value = value = next_value;
          if (ctx.settled) {
            task = null;
          }

          return !ctx.settled;
        });
      }

      return new Promise((fullfill) => {
        if (token === current_token) fullfill();
      });
    }

    const spring = {
      _value: value,
      get value() {
        return this._value;
      },
      set value(v) {
        if (typeof v === "object") {
          Object.keys(v).forEach((key) => {
            this._value[key] = v[key];
          });
        } else {
          this._value = v;
        }
      },
      set,
      update(fn, opts) {
        return this.set(fn(target_value, value), opts);
      },
      stiffness,
      damping,
      precision,
    };

    return spring;
  }
);
