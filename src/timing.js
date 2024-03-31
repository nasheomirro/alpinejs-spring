export const raf = {
  tick: (_) => requestAnimationFrame(_),
  now: () => performance.now(),
  tasks: new Set(),
};

/** keeps running requestAnimationFrame for each task currently animating */
export function run_tasks(now) {
  raf.tasks.forEach((task) => {
    // if a task returns false, end it.
    if (!task.c(now)) {
      raf.tasks.delete(task);
      task.f();
    }
  });

  // if a task is still active, tick until all tasks are complete
  if (raf.tasks.size !== 0) {
    raf.tick(run_tasks);
  }
}

export function loop(callback) {
  let task;

  // start the tick if it isn't currently looping
  if (raf.tasks.size === 0) {
    raf.tick(run_tasks);
  }

  return {
    promise: new Promise((fullfill) => {
      raf.tasks.add((task = { c: callback, f: fullfill }));
    }),
  };
}
