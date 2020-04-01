const Listr = require('listr')

const tasks = new Listr([
  {
    title: 'Git',
    task: () => {
      return new Listr([
        {
          title: 'Checking git status',
          task: () => new Promise((resolve) => setTimeout(resolve, 300))
        },
        {
          title: 'Checking remote history',
          task: () => new Promise((resolve) => setTimeout(resolve, 500))
        }
      ])
    }
  }
])

tasks.run()
