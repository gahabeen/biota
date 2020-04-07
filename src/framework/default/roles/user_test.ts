export const user = {
  name: "user",
  collections: {
    todos: {
      // doc
      create: {
        any: true,
        owned: true,
      },
      // ref
      read: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      // ref
      read_history: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      //[oldDoc, newDoc]
      write: {
        _all: {
          all: true,
          owned: true,
          others: true,
          assigned: true,
          none: true,
          except: () => {},
        },
        _activity: {
          none: true,
          except: () => {},
        },
      },
      //["ref", "ts", "action", "data"]
      write_history: {
        all: true,
        owned: true,
        others: true,
        none: true,
        except: () => {},
        assigned: true,
      },
      // ref
      forget: {
        all: true,
        owned: true,
        others: true,
        none: true,
        except: () => {},
        assigned: true,
      },

      // SPECIAL!
      own: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      assign: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      unassign: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      expire: {
        all: true,
        owned: true,
        assigned: true,
        others: true,
        none: true,
        except: () => {},
      },
      delete: {
        all: true,
        owned: true,
        others: true,
        none: true,
        except: () => {},
        assigned: true,
      },
    },
  },
};
