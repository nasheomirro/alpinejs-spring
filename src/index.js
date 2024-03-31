import { tick_spring } from "./tick";
import { loop, raf } from "./timing";

export default function (Alpine) {
  Alpine.magic("spring", (el, { Alpine }) => {
    return (value = undefined, opts = {}) => {
      const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;

      let last_time;
      let task;
      let last_value = value;
      let target_value = value;

      let inv_mass = 1;
      let inv_mass_recovery_rate = 0;
      let cancel_task = false;

      // make sure we cancel any ongoing animations when destroyed
      Alpine.onElRemoved(el, () => {
        cancel_task = true;
        task = null;
      });

      function set(new_value, opts = {}) {
        target_value = new_value;

        if (
          value == null ||
          opts.hard ||
          (this.stiffness >= 1 && this.damping >= 1)
        ) {
          cancel_task = true; // cancel any runnning animation
          last_time = raf.now();
          last_value = target_value;
          this.value = value = target_value;
          return;
        } else if (opts.soft) {
          const rate = opts.soft === true ? 0.5 : +opts.soft;
          inv_mass_recovery_rate = 1 / (rate * 60);
          inv_mass = 0; // infinite mass makes it unaffected by spring forces
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

            // gradually recover mass if `soft` was given
            inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
            const ctx = {
              inv_mass,
              opts: this,
              settled: true,
              dt: ((now - last_time) * 60) / 1000,
            };

            const next_value = tick_spring(
              ctx,
              last_value,
              value,
              target_value
            );

            last_time = now;
            last_value = value;
            this.value = value = next_value;

            // check if tick spring has determined it's finished
            if (ctx.settled) {
              task = null;
            }

            return !ctx.settled;
          });
        }
      }

      const spring = {
        value,
        set,
        update(fn, opts) {
          return this.set(fn(target_value, value), opts);
        },
        stiffness,
        damping,
        precision,
      };

      return spring;
    };
  });
}
