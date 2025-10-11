/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("15hvubifh7kgq3b")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = null
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("15hvubifh7kgq3b")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = ""
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
