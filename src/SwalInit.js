import Swal from "sweetalert2"

const Cswa = Swal.mixin({
    showCancelButton: true,
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading()
})

export default Cswa;