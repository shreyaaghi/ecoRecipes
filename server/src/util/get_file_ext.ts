const get_file_ext = (file: File): string => {
    let ext = file.type.toString();
    let sections = ext.split("/");
    ext = sections[sections.length - 1];
    return ext;
}

export { get_file_ext };