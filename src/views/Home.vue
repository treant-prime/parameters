<template lang="pug">
  .container
    template(v-if="accessGranted")
      .search-bar
        .form-group.search-bar-input-wrapper
          input.form-control(v-bind:value="search" v-on:input="search= $event.target.value" type="text" placeholder="Search")
          button.btn.btn-primary(type="button" @click="addNewNote()") + Add

        ul.nav.nav-tabs.nav-justified
          li.nav-item(@click="setTypeVisible('global')")
            span.nav-link(:class="{'active text-primary':typeVisible=='global'}") Global
          li.nav-item(@click="setTypeVisible('local')")
            span.nav-link(:class="{'active text-primary':typeVisible=='local'}") Local

      .row.notes-wrapper
        .col
          .row
            .col-12.col-md-3(v-if="newNoteVisible")
              .note-empty-backdrop(@click.self="closeNewNote()")
                .note-empty
                  .h5.text-primary New note
                  form(@submit="saveNewNote")
                    input.mb-3.form-control(v-bind:value="newNote.title" v-on:input="newNote.title=$event.target.value" placeholder="Title")
                    textarea.mb-3.form-control(v-bind:value="newNote.desc" v-on:input="newNote.desc=$event.target.value" placeholder="Description")
                    input.mb-3.form-control(v-bind:value="newNote.img" v-on:input="newNote.img=$event.target.value" placeholder="Image link")
                    input.btn.btn-primary.btn-block(type="submit" value="Save")

            .col-12.col-md-3(v-for="(note, index) in intelligentGlobalNotes" v-if="typeVisible == 'global'")
              .note
                .note-header
                  h4 {{note.title}}
                  button.btn.btn-danger(type="button" @click="deleteNote(index)") Delete
                p {{note.desc}}
                img(:src="note.img")

            .col-12.col-md-3(v-for="(note, index) in intelligentLocalNotes" v-if="typeVisible == 'local'")
              .note
                .note-header
                  h4 {{note.title}}
                  button.btn.btn-danger(type="button" @click="deleteNote(index)") Delete
                p {{note.desc}}
                img(:src="note.img")

    .access-lock(v-if="!accessGranted")
      .form-group.text-center
        h5 Provide password
        form(@submit="grantAaccess")
          input.form-control.mb-3(v-bind:value="password" v-on:input="password= $event.target.value" type="password" placeholder="Search")
          input.btn.btn-primary.btn-block(type="submit" value="Grant sccess")

</template>

<script>
import db from '@/views/_shared/db.js';
var notesGlobalRef = db.ref('notesGlobalRef');

export default {
  name: "home",

  data: function() {
    return {
      search: "",
      notesLocal: [],
      // notesGlobal: [], this come from firebase as this.notesGlobal
      newNote: { title: "", img: "", desc: "", type: "local" },
      newNoteVisible: false,
      typeVisible: "global",
      accessGranted: false,
      password: ""
    };
  },

  created() {
    this.checkAccessToken();
  },

  mounted() {
    let notesFormStorage = JSON.parse(localStorage.getItem("tzeentch_notes"));
    !!notesFormStorage ? (this.notesLocal = notesFormStorage) : null;
  },

  computed: {
    intelligentGlobalNotes() {
      let filtered = this.notesGlobal.filter(note => { // this.notesGlobal comes form firebase
        return (
          note.title.toLowerCase().includes(this.search.toLowerCase())
        );
      });
      return filtered;
    },

    intelligentLocalNotes() {
      let filtered = this.notesLocal.filter(note => {
        return (
          note.title.toLowerCase().includes(this.search.toLowerCase())
        );
      });
      return filtered;
    }
  },
  methods: {
    addNewNote() {
      this.newNote.title = "";
      this.newNote.img = "";
      this.newNote.desc = "";
      this.newNoteVisible = true;
    },

    saveNewNote(e) {
      // based on this.typeVisible context
      if (!!this.newNote.title) {

        // global
        if(this.typeVisible == 'global') {
          notesGlobalRef.push({ ...this.newNote, type: 'global' });

        // local
        } else {
          this.notesLocal.unshift({ ...this.newNote, type: 'local' });
          localStorage.setItem("tzeentch_notes", JSON.stringify(this.notesLocal)); //updates localStorage
        }

        this.newNoteVisible = false;
      }
    },

    deleteNote(i) {
      // based on this.typeVisible context

      if(confirm('Delete it?')) {
        // global
        if(this.typeVisible == 'global') {
          let item = this.notesGlobal[i];
          notesGlobalRef.child(item['.key']).remove();

        // local
        } else {
          this.notesLocal.splice(i, 1);
          localStorage.setItem("tzeentch_notes", JSON.stringify(this.notesLocal));
        }
      }
    },

    closeNewNote() {
      this.newNoteVisible = false;
    },

    setTypeVisible(type) {
      this.typeVisible = type;
    },

    grantAaccess(e) {
      if (this.password == "umgak") {
        this.accessGranted = true;
        localStorage.setItem("tzeentch_access_token", true);
      }
    },

    checkAccessToken() {
      let accessToken = localStorage.getItem("tzeentch_access_token");
      !!accessToken ? (this.accessGranted = true) : null;
    },

    setAccessToken() {
      localStorage.setItem("tzeentch_access_token", true);
    }
  },
  firebase: {
    notesGlobal: {
      source: notesGlobalRef
    }
  }
};
</script>

<style lang="scss" scoped>
.search-bar {
  padding: 15px 15px 0px 15px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 110px;
  background: white;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .search-bar-input-wrapper {
    width: 100%;
    display: flex;

    input {
      flex: 3;
      margin-right: 15px;
    }
    button {
      flex: 1;
    }
  }

  ul {
    width: 100%;
  }
}

.notes-wrapper {
  height: calc(100vh - 110px);
  overflow-y: scroll;
  margin-top: 110px;
  padding-top: 15px;
  background: aliceblue;

  .note {
    padding: 15px;
    box-shadow: 0px 0 10px 0px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
    background: white;

    .note-header {
      display: flex;

      h4 {
        flex: 6;
      }

      button {
        min-width: 70px;
        flex: 1;
      }
    }

    img {
      width: 100%;
    }
  }

  .note-empty-backdrop {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;

    .note-empty {
      padding: 15px;
      box-shadow: 0px 0 10px 0px rgba(0, 0, 0, 0.2);
      margin-bottom: 15px;
      background: white;
      display: flex;
      flex-direction: column;
      width: 100%;

      textarea {
        height: 150px;
      }
    }
  }
}

.access-lock {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 2;
  padding: 15px;

  .form-group {
    width: 100%;
  }
}
</style>