import { column, defineDb, defineTable } from 'astro:db';

const Issue = defineTable({
  columns: {
    id: column.number({
      primaryKey: true,
      unique: true
    }),
    lead: column.text({ 
      name: "Lead", 
      unique: true, 
      default: "Subject line for email"
    }),
    editorialId: column.number({ references: () => Editorial.columns.id }),
    featureId: column.number({ references: () => Feature.columns.id })
  },
});

const Editorial = defineTable({
  columns: {
    id: column.number({ 
      primaryKey: true, 
      unique: true,
    }),
    subject: column.text({ 
      name: "Subject",
      unique: true,
      default: "What do I want to talk about?"
    }),
    content: column.text({
      name: "Content",
      multiline: true 
    })
  },
});

const Feature = defineTable({
  columns: {
    id: column.number({
      primaryKey: true,
      unique: true
    }),
    headline: column.text({
      name: "Headline",
      unique: true,
      default: "News for the week"
    }),
    content: column.text({
      name: "Content",
      multiline: true
    })
  }
});

const Listicle = defineTable({
  columns: { 
    id: column.number({
      primaryKey: true,
      unique: true
    }),
    content: column.text({
      name: "Content"
    }),
    issueId: column.number({ references: () => Issue.columns.id })
  }
})

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text(),
    hashed_password: column.text()
  }
});

const Session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true
    }),
    expiresAt: column.date(),
    userId: column.text({
      references: () => User.columns.id
    })
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Issue, 
    Editorial, 
    Feature, 
    Listicle,
    User,
    Session
  }
});
