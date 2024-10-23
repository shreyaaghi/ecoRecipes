const get_file_ext = (file: string): string => {
    // let ext = file.type.toString();
    let sections = file.split("/");
    let ext = sections[sections.length - 1];
    return ext;
}

export { get_file_ext };