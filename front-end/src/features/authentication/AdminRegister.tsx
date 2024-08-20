import { useForm, Controller } from 'react-hook-form';
import { registerAdminAsync } from './authenticationSlice';
import { useAppDispatch } from '../../app/hooks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Register } from '../../models/Authentication';
import 'react-toastify/dist/ReactToastify.css';
import './authentication.css';



const AdminRegister = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {control, handleSubmit, watch, formState: { errors }} = useForm<Register>
    ({
        defaultValues:
        {
            username: '',
            password: '',
            confirmPassword: '',
            instrument: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data: Register) => {
        const userData = {
            username: data.username,
            password: data.password,
            instrument: data.instrument,
        };

        dispatch(registerAdminAsync(userData));
        navigate('/authentication/login');
        toast.success(`Welcome to the band ${data.username}!`);
    };

    return (
        <div className="register-page">
            <div className="register-logo-container">
                <img alt="logo" height="50px" src={require(`../../images/logo.png`)} />
            </div>

            <div className="register-message">
                <span>Interested in being the <b className="band-manager-highlight">band manager</b>? Register now!</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <Controller name="username"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (<TextField
                                                        type="text"
                                                        label="Username"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        error={!!errors.username}
                                                        helperText={errors.username ? "Username is required" : ""} />)}
                    />
                </div>

                <div className="form-group">
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Instrument</InputLabel>
                        <Controller
                            name="instrument"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Instrument">
                                    <MenuItem value="" disabled>Select Instrument</MenuItem>
                                    <MenuItem value="drums">Drums</MenuItem>
                                    <MenuItem value="guitars">Guitars</MenuItem>
                                    <MenuItem value="bass">Bass</MenuItem>
                                    <MenuItem value="saxophone">Saxophone</MenuItem>
                                    <MenuItem value="keyboards">Keyboards</MenuItem>
                                    <MenuItem value="vocals">Vocals</MenuItem>
                                </Select>)} />
                    </FormControl>
                </div>

                <div className="form-group">
                    <Controller name="password"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (<TextField type="password"
                                                        label="Password"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        error={!!errors.password}
                                                        helperText={errors.password ? "Password is required" : ""} />)}
                    />
                </div>

                <div className="form-group">
                    <Controller name="confirmPassword"
                                 control={control}
                                 rules={{ required: true, validate: (value) => value === password || "Passwords do not match" }}
                                 render={({ field }) => (<TextField
                                                        type="password"
                                                        label="Confirm Password"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        error={!!errors.confirmPassword}
                                                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ""} />)}
                    />
                </div>

                <div className="button-container">
                    <Button type="submit" variant="contained" style = {{backgroundColor: "#A28B55"}}>
                        Create Account
                    </Button>

                    <span className="login-link-container">
                        Already part of JaMoveo? <a onClick={() => navigate('/authentication/login')} className="login-link">Sign in</a>!
                    </span>
                </div>
            </form>
        </div>
    );
}

export default AdminRegister;