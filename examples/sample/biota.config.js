module.exports = {
  name: "todo",
  collections: {
    todos: {
      fields: [
        {
          field: "~ref",
          searchable: true
        },
        {
          field: "~ts",
          searchable: true
        },
        {
          field: "name",
          searchable: true
        },
        {
          field: "description",
          autocomplete: true,
          searchable: true
        },
        {
          field: "name",
          protected: {
            role: "admin"
          }
        },
        {
          field: "definition.colors",
          binding: q.Query(q.Lambda())
        }
      ],
      relations: [
        {
          name: "todos_ownership",
          many: {
            collection: "todo",
            at: "activity.owner"
          },
          one: "user"
        }
      ]
    }
  }
};
