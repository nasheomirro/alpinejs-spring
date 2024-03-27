/** could probably be simplified */

export const raf = {
  tick: (_) => requestAnimationFrame(_),
  now: () => performance.now(),
  tasks: new Set(),
};

export function run_tasks(now) {
  raf.tasks.forEach((task) => {
    if (!task.c(now)) {
      raf.tasks.delete(task);
      task.f();
    }
  });

  if (raf.tasks.size !== 0) {
    raf.tick(run_tasks);
  }
}

export function loop(callback) {
  let task;

  if (raf.tasks.size === 0) {
    raf.tick(run_tasks);
  }

  return {
    promise: new Promise((fullfill) => {
      raf.tasks.add((task = { c: callback, f: fullfill }));
    }),
    abort() {
      raf.tasks.delete(task);
    },
  };
}
