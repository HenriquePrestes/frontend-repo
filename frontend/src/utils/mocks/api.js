export const getAvailableTimes = (doctorId, date) => {
    console.log(`Buscando horários para o médico ${doctorId} na data ${date.toDateString()}`);
    
    return new Promise(resolve => {
        setTimeout(() => {
            if (date.getDate() % 2 === 0) {
                resolve(['09:00', '10:00', '11:00', '14:00', '15:00']);
            } else {
                resolve(['09:30', '10:30', '11:30', '14:30', '15:30', '16:30']);
            }
        }, 1000);
    });
};