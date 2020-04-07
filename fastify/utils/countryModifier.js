

function countryName(desh) {
    desh = desh.toLowerCase();
    const findSpace = desh.indexOf(' ');
    const findDot = desh.indexOf('.');

    if(findSpace !== -1 && desh.slice(findSpace+1,).search(/\w/) !== -1) {
        const parts = desh.split(' ').filter(item => item !== '');
        const parts0 = parts[0][0].toUpperCase() + parts[0].slice(1,).toLowerCase();
        const parts1 = parts[1][0].toUpperCase() + parts[1].slice(1,).toLowerCase();
        return parts0+' '+parts1;
    }
    if(findDot !== -1 && desh.slice(findDot+1,).search(/\w/) !== -1 ) {
        const parts = desh.split('.').filter(item => item !== '');
        const parts0 = parts[0][0].toUpperCase() + parts[0].slice(1,).toLowerCase() ;
        const parts1 = parts[1][0].toUpperCase() + parts[1].slice(1,).toLowerCase() ;
        return parts0+'.'+parts1;
    }
    const modifyCountry = desh.length <= 3 ? desh.toUpperCase() : desh.replace(desh[0], desh[0].toUpperCase());
    return modifyCountry
}

module.exports = countryName;