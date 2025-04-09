export class Filme {
    constructor(id, title, description, gender, classification, duration, releaseDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.gender = gender;
        this.classification = classification;
        this.duration = duration;
        this.releaseDate = releaseDate;
    }
    getTitle() {
        return this._title;
    }

    setTitle(value) {
        this._title = value;
    }

    getDescription() {
        return this._description;
    }

    setDescription(value) {
        this._description = value;
    }

    getGender() {
        return this._gender;
    }

    setGender(value) {
        this._gender = value;
    }

    getClassification() {
        return this._classification;
    }

    setClassification(value) {
        this._classification = value;
    }

    getDuration() {
        return this._duration;
    }

    setDuration(value) {
        this._duration = value;
    }

    getReleaseDate() {
        return this._releaseDate;
    }

    setReleaseDate(value) {
        this._releaseDate = value;
    }
}