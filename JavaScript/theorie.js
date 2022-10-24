import { Octokit } from "https://cdn.skypack.dev/octokit";
var sha = "";
var cma = "hello";

async function getFile(lesson) {

    const Token = process.env.TOKEN;
    const octokit = new Octokit({
        auth: Token
    });

    try {
        const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: "LordBaljeet",
            repo: "Notes",
            path: `${lesson}/Theorie.md`
        });
        sha = result.data.sha;
        sessionStorage.setItem('fileExists', result.data.content != null ? true : false);
        return result.data.content;
    } catch {
        console.log("No such repository");
        sessionStorage.setItem('fileExists', false);
        return null;
    }
}

function newMd(content) {
    var md = editormd("editor", {
        path: `../node_modules/editor.md/lib/`,
        theme: "dark",
        editorTheme: "blackboard",
        previewTheme: "dark",
        tocm: true,
        tocDropdown: true,
        markdown: content != null ? content : "Such Emptyness...",
        codeFold: true,
        emoji: true,
        saveHTMLToTextarea: true,
        onload() {
            sessionStorage.setItem('content', this.cm.getValue());
            this.toolbarHandlers.fullscreen.call(md);
            this.toolbarHandlers.preview.call(md);
            this.fullscreen;
            cma = this.cm;
            const btn = $('#saveToGit');
            const btnLi = $('#saveLi');
            $('.editormd-menu').append(btnLi);
            $(btnLi).append(btn);
        },
        onchange() {
            this.cm.save();
            cma = this.cm;
            sessionStorage.setItem('content', this.cm.getValue());
        },
    });
    return md;
}

async function uploadFile(content, commit) {

    const lesson = sessionStorage.getItem('name');
    console.log(lesson);

    const Token = "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";
    const octokit = new Octokit({
        auth: Token
    });
    if (sessionStorage.getItem('fileExists')=="true") {

        console.log("repo exists");
        console.log("sha: ", sha);
        console.log("content: ", content);

        const result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: "LordBaljeet",
            repo: "Notes",
            path: `${lesson}/Theorie.md`,
            message: commit,
            content: btoa(content),
            sha: sha
        });
        console.log("new file " + result.data);
    } else {
        console.log("repo doesn't exist");
        const result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: "LordBaljeet",
            repo: "Notes",
            path: `${lesson}/Theorie.md`,
            message: commit,
            content: btoa(content),
        });
        console.log("new file " + result.data);
    }
}

function uploadModal() {
    $('#saveToGit').on('click', () => {
        $('.modal').css('display', 'block');
    });
    $('.closeModal').on('click', () => {
        $('.modal').css('display', 'none');
        $('#commitMsg').val("");
    });
}

function upload(){
    $('#upload').on('click', async () => {
        if($('form')[0].checkValidity()){
        console.log("form valid!");
        const commit = $('#commitMsg').val();
        const content = sessionStorage.getItem('content');
        await uploadFile(content,commit);
    }
});

}
$(async function () {
    document.title = `Theorie | ${sessionStorage.getItem('name')}`
    const contentRaw = await getFile(sessionStorage.getItem('name'));
    const content = contentRaw == null ? null: atob(contentRaw);
    newMd(content);
    $('#commitMsg').val("");
    uploadModal();
    upload();
});
