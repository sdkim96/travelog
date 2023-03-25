CKEDITOR.editorConfig = function (config) {

    config.toolbar = [{ name: 'tools', items: ['Maximize','Source'] }];

    config.removeButtons = 'CodeSnippet,NewPage,Save,Preview,Print,Templates,Bold,RemoveFormat,Italic,Underline,Strike,Subscript,Superscript,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Font,FontSize,Styles,About,Cut,Copy,Paste,PasteText,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,ShowBlocks';

    config.htmlEncodeOutput = false; // html 태그 그대로 보여질 경우

    config.enterMode = CKEDITOR.ENDTER_BR; // <P>태그 제거

    config.allowedContent = true; // html 태그 자동삭제 방지 설정

    config.height = 300;

    CKEDITOR.editorConfig = function( config ) {
        config.enterMode = CKEDITOR.ENTER_BR

    };
};